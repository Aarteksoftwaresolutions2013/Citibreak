package fr.littlereddot.pocket.site.service;

import fr.littlereddot.pocket.client.resource.VoteResource;
import fr.littlereddot.pocket.core.entity.Rating;
import fr.littlereddot.pocket.core.entity.Vote;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Service
public class VoteService {

    @Autowired
    private VoteResource voteResource;

    public Vote findBySubjectIdAndUserId(ObjectId userId, ObjectId subjectId) {
        return voteResource.getByUserAndSubject(userId, subjectId);
    }

    public Rating save(ObjectId userId, String indexType, ObjectId subjectId, Integer rating) {
        return voteResource.save(new Vote(userId, indexType, subjectId, rating));
    }

}
